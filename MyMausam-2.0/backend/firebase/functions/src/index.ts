import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Trigger on new emergency alert creation to broadcast notifications
export const onWeatherAlertCreated = functions.firestore
  .document("alerts/{alertId}")
  .onCreate(async (snapshot, context) => {
    const alertData = snapshot.data();
    const alertId = context.params.alertId;

    console.log(`Processing new emergency weather alert ${alertId}: ${alertData.alert_type} for ${alertData.location_name}`);

    // Send FCM push notification topic message
    const message = {
      notification: {
        title: `🚨 IMD Warning: ${alertData.alert_type}`,
        body: `${alertData.location_name}: ${alertData.description}`,
      },
      data: {
        alertId: alertId,
        severity: alertData.severity || "warning",
      },
      topic: "weather_alerts",
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("FCM alert sent successfully:", response);
    } catch (error) {
      console.error("Failed to broadcast FCM weather alert:", error);
    }
  });

// Hourly cleanup for expired alerts
export const cleanupExpiredAlerts = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async () => {
    const now = new Date().toISOString();
    const expiredQuery = db.collection("alerts").where("valid_upto", "<", now);
    const snapshot = await expiredQuery.get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { is_active: false, status_text: "Expired" });
    });

    await batch.commit();
    console.log(`Deactivated ${snapshot.size} expired alerts.`);
  });
