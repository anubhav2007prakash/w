/**
 * Comprehensive Indian cities & districts database for offline location search.
 * Used as fallback when the backend /api/locations endpoint is unavailable.
 * Coordinates are approximate centroids for each city.
 */

export interface IndianCity {
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
}

export const INDIAN_CITIES: IndianCity[] = [
  // ── Union Territories ──────────────────────────────────
  { name: "New Delhi", district: "New Delhi", state: "Delhi", latitude: 28.6139, longitude: 77.2090 },
  { name: "Delhi", district: "New Delhi", state: "Delhi", latitude: 28.7041, longitude: 77.1025 },
  { name: "Chandigarh", district: "Chandigarh", state: "Chandigarh", latitude: 30.7333, longitude: 76.7794 },
  { name: "Puducherry", district: "Puducherry", state: "Puducherry", latitude: 11.9416, longitude: 79.8083 },
  { name: "Srinagar", district: "Srinagar", state: "Jammu & Kashmir", latitude: 34.0837, longitude: 74.7973 },
  { name: "Jammu", district: "Jammu", state: "Jammu & Kashmir", latitude: 32.7266, longitude: 74.8570 },
  { name: "Leh", district: "Leh", state: "Ladakh", latitude: 34.1526, longitude: 77.5771 },
  { name: "Kavaratti", district: "Kavaratti", state: "Lakshadweep", latitude: 10.5626, longitude: 72.6369 },
  { name: "Port Blair", district: "South Andaman", state: "Andaman & Nicobar", latitude: 11.6234, longitude: 92.7265 },
  { name: "Gandhinagar", district: "Gandhinagar", state: "Gujarat", latitude: 23.2156, longitude: 72.6369 },
  { name: "Daman", district: "Daman", state: "Dadra & Nagar Haveli", latitude: 20.3974, longitude: 72.8354 },
  { name: "Silvassa", district: "Dadra & Nagar Haveli", state: "Dadra & Nagar Haveli", latitude: 20.2753, longitude: 73.0097 },

  // ── Uttar Pradesh ──────────────────────────────────────
  { name: "Lucknow", district: "Lucknow", state: "Uttar Pradesh", latitude: 26.8467, longitude: 80.9462 },
  { name: "Noida", district: "Gautam Buddha Nagar", state: "Uttar Pradesh", latitude: 28.5355, longitude: 77.3910 },
  { name: "Ghaziabad", district: "Ghaziabad", state: "Uttar Pradesh", latitude: 28.6692, longitude: 77.4538 },
  { name: "Agra", district: "Agra", state: "Uttar Pradesh", latitude: 27.1767, longitude: 78.0081 },
  { name: "Varanasi", district: "Varanasi", state: "Uttar Pradesh", latitude: 25.3176, longitude: 82.9739 },
  { name: "Kanpur", district: "Kanpur Nagar", state: "Uttar Pradesh", latitude: 26.4499, longitude: 80.3319 },
  { name: "Prayagraj", district: "Prayagraj", state: "Uttar Pradesh", latitude: 25.4358, longitude: 81.8463 },
  { name: "Meerut", district: "Meerut", state: "Uttar Pradesh", latitude: 28.9845, longitude: 77.7064 },
  { name: "Bareilly", district: "Bareilly", state: "Uttar Pradesh", latitude: 28.3670, longitude: 79.4304 },
  { name: "Aligarh", district: "Aligarh", state: "Uttar Pradesh", latitude: 27.8974, longitude: 78.0880 },
  { name: "Moradabad", district: "Moradabad", state: "Uttar Pradesh", latitude: 28.8386, longitude: 78.7733 },
  { name: "Jhansi", district: "Jhansi", state: "Uttar Pradesh", latitude: 25.4484, longitude: 78.5685 },
  { name: "Gorakhpur", district: "Gorakhpur", state: "Uttar Pradesh", latitude: 26.7606, longitude: 83.3732 },
  { name: "Mathura", district: "Mathura", state: "Uttar Pradesh", latitude: 27.4924, longitude: 77.6737 },
  { name: "Ayodhya", district: "Ayodhya", state: "Uttar Pradesh", latitude: 26.7922, longitude: 82.1998 },
  { name: "Nagpur", district: "Nagpur", state: "Maharashtra", latitude: 21.1458, longitude: 79.0882 },

  // ── Maharashtra ────────────────────────────────────────
  { name: "Mumbai", district: "Mumbai City", state: "Maharashtra", latitude: 19.0760, longitude: 72.8777 },
  { name: "Pune", district: "Pune", state: "Maharashtra", latitude: 18.5204, longitude: 73.8567 },
  { name: "Nashik", district: "Nashik", state: "Maharashtra", latitude: 19.9975, longitude: 73.7898 },
  { name: "Thane", district: "Thane", state: "Maharashtra", latitude: 19.2183, longitude: 72.9781 },
  { name: "Aurangabad", district: "Chhatrapati Sambhajinagar", state: "Maharashtra", latitude: 19.8762, longitude: 75.3433 },
  { name: "Solapur", district: "Solapur", state: "Maharashtra", latitude: 17.6599, longitude: 75.9064 },
  { name: "Amravati", district: "Amravati", state: "Maharashtra", latitude: 20.9374, longitude: 77.7796 },

  // ── Gujarat ────────────────────────────────────────────
  { name: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", latitude: 23.0225, longitude: 72.5714 },
  { name: "Surat", district: "Surat", state: "Gujarat", latitude: 21.1702, longitude: 72.8311 },
  { name: "Vadodara", district: "Vadodara", state: "Gujarat", latitude: 22.3072, longitude: 73.1812 },
  { name: "Rajkot", district: "Rajkot", state: "Gujarat", latitude: 22.3039, longitude: 70.8022 },
  { name: "Bhuj", district: "Kutch", state: "Gujarat", latitude: 23.2509, longitude: 69.6702 },

  // ── Rajasthan ──────────────────────────────────────────
  { name: "Jaipur", district: "Jaipur", state: "Rajasthan", latitude: 26.9124, longitude: 75.7873 },
  { name: "Jodhpur", district: "Jodhpur", state: "Rajasthan", latitude: 26.2389, longitude: 73.0243 },
  { name: "Udaipur", district: "Udaipur", state: "Rajasthan", latitude: 24.5854, longitude: 73.7125 },
  { name: "Kota", district: "Kota", state: "Rajasthan", latitude: 25.2138, longitude: 75.8648 },
  { name: "Ajmer", district: "Ajmer", state: "Rajasthan", latitude: 26.4499, longitude: 74.6399 },
  { name: "Bikaner", district: "Bikaner", state: "Rajasthan", latitude: 28.0229, longitude: 73.3114 },
  { name: "Jaisalmer", district: "Jaisalmer", state: "Rajasthan", latitude: 26.9157, longitude: 70.9083 },

  // ── Madhya Pradesh ─────────────────────────────────────
  { name: "Bhopal", district: "Bhopal", state: "Madhya Pradesh", latitude: 23.2599, longitude: 77.4126 },
  { name: "Indore", district: "Indore", state: "Madhya Pradesh", latitude: 22.7196, longitude: 75.8577 },
  { name: "Gwalior", district: "Gwalior", state: "Madhya Pradesh", latitude: 26.2183, longitude: 78.1828 },
  { name: "Jabalpur", district: "Jabalpur", state: "Madhya Pradesh", latitude: 23.1815, longitude: 79.9864 },
  { name: "Ujjain", district: "Ujjain", state: "Madhya Pradesh", latitude: 23.1765, longitude: 75.7885 },

  // ── Karnataka ──────────────────────────────────────────
  { name: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", latitude: 12.9716, longitude: 77.5946 },
  { name: "Mysuru", district: "Mysuru", state: "Karnataka", latitude: 12.2958, longitude: 76.6394 },
  { name: "Hubli-Dharwad", district: "Dharwad", state: "Karnataka", latitude: 15.3647, longitude: 75.1240 },
  { name: "Mangaluru", district: "Dakshina Kannada", state: "Karnataka", latitude: 12.9141, longitude: 74.8560 },
  { name: "Belgaum", district: "Belagavi", state: "Karnataka", latitude: 15.8497, longitude: 74.4977 },

  // ── Tamil Nadu ─────────────────────────────────────────
  { name: "Chennai", district: "Chennai", state: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707 },
  { name: "Coimbatore", district: "Coimbatore", state: "Tamil Nadu", latitude: 11.0168, longitude: 76.9558 },
  { name: "Madurai", district: "Madurai", state: "Tamil Nadu", latitude: 9.9252, longitude: 78.1198 },
  { name: "Tiruchirappalli", district: "Tiruchirappalli", state: "Tamil Nadu", latitude: 10.7905, longitude: 78.7047 },
  { name: "Salem", district: "Salem", state: "Tamil Nadu", latitude: 11.6643, longitude: 78.1460 },
  { name: "Tirunelveli", district: "Tirunelveli", state: "Tamil Nadu", latitude: 8.7139, longitude: 77.7567 },

  // ── Kerala ─────────────────────────────────────────────
  { name: "Thiruvananthapuram", district: "Thiruvananthapuram", state: "Kerala", latitude: 8.5241, longitude: 76.9366 },
  { name: "Kochi", district: "Ernakulam", state: "Kerala", latitude: 9.9312, longitude: 76.2673 },
  { name: "Kozhikode", district: "Kozhikode", state: "Kerala", latitude: 11.2588, longitude: 75.7804 },
  { name: "Kannur", district: "Kannur", state: "Kerala", latitude: 11.8745, longitude: 75.3704 },
  { name: "Kottayam", district: "Kottayam", state: "Kerala", latitude: 9.5916, longitude: 76.5223 },

  // ── West Bengal ────────────────────────────────────────
  { name: "Kolkata", district: "Kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639 },
  { name: "Darjeeling", district: "Darjeeling", state: "West Bengal", latitude: 27.0360, longitude: 88.2627 },
  { name: "Howrah", district: "Howrah", state: "West Bengal", latitude: 22.5726, longitude: 88.3183 },
  { name: "Durgapur", district: "Paschim Bardhaman", state: "West Bengal", latitude: 23.5204, longitude: 87.3119 },
  { name: "Siliguri", district: "Darjeeling", state: "West Bengal", latitude: 26.7271, longitude: 88.3953 },

  // ── Andhra Pradesh ─────────────────────────────────────
  { name: "Visakhapatnam", district: "Visakhapatnam", state: "Andhra Pradesh", latitude: 17.6868, longitude: 83.2185 },
  { name: "Vijayawada", district: "NTR", state: "Andhra Pradesh", latitude: 16.5062, longitude: 80.6480 },
  { name: "Guntur", district: "Guntur", state: "Andhra Pradesh", latitude: 16.3067, longitude: 80.4365 },
  { name: "Tirupati", district: "Chittoor", state: "Andhra Pradesh", latitude: 13.6288, longitude: 79.4192 },

  // ── Telangana ──────────────────────────────────────────
  { name: "Hyderabad", district: "Hyderabad", state: "Telangana", latitude: 17.3850, longitude: 78.4867 },
  { name: "Warangal", district: "Warangal", state: "Telangana", latitude: 17.9784, longitude: 79.5941 },
  { name: "Karimnagar", district: "Karimnagar", state: "Telangana", latitude: 18.4386, longitude: 79.1288 },

  // ── Bihar ──────────────────────────────────────────────
  { name: "Patna", district: "Patna", state: "Bihar", latitude: 25.6093, longitude: 85.1376 },
  { name: "Gaya", district: "Gaya", state: "Bihar", latitude: 24.7963, longitude: 84.9951 },
  { name: "Muzaffarpur", district: "Muzaffarpur", state: "Bihar", latitude: 26.1209, longitude: 85.3647 },

  // ── Odisha ─────────────────────────────────────────────
  { name: "Bhubaneswar", district: "Khordha", state: "Odisha", latitude: 20.2961, longitude: 85.8245 },
  { name: "Cuttack", district: "Cuttack", state: "Odisha", latitude: 20.4625, longitude: 85.8830 },
  { name: "Puri", district: "Puri", state: "Odisha", latitude: 19.8135, longitude: 85.8312 },

  // ── Punjab ─────────────────────────────────────────────
  { name: "Ludhiana", district: "Ludhiana", state: "Punjab", latitude: 30.9010, longitude: 75.8573 },
  { name: "Amritsar", district: "Amritsar", state: "Punjab", latitude: 31.6340, longitude: 74.8723 },
  { name: "Jalandhar", district: "Jalandhar", state: "Punjab", latitude: 31.3260, longitude: 75.5762 },
  { name: "Patiala", district: "Patiala", state: "Punjab", latitude: 30.3398, longitude: 76.3869 },

  // ── Haryana ────────────────────────────────────────────
  { name: "Gurugram", district: "Gurugram", state: "Haryana", latitude: 28.4595, longitude: 77.0266 },
  { name: "Faridabad", district: "Faridabad", state: "Haryana", latitude: 28.4089, longitude: 77.3178 },
  { name: "Panipat", district: "Panipat", state: "Haryana", latitude: 29.3909, longitude: 76.9635 },
  { name: "Ambala", district: "Ambala", state: "Haryana", latitude: 30.3752, longitude: 76.7821 },

  // ── Himachal Pradesh ───────────────────────────────────
  { name: "Shimla", district: "Shimla", state: "Himachal Pradesh", latitude: 31.1048, longitude: 77.1734 },
  { name: "Manali", district: "Kullu", state: "Himachal Pradesh", latitude: 32.2432, longitude: 77.1892 },
  { name: "Dharamshala", district: "Kangra", state: "Himachal Pradesh", latitude: 32.2190, longitude: 76.3190 },
  { name: "Kullu", district: "Kullu", state: "Himachal Pradesh", latitude: 31.9580, longitude: 77.1090 },
  { name: "Mandi", district: "Mandi", state: "Himachal Pradesh", latitude: 31.7087, longitude: 76.9335 },
  { name: "Chamba", district: "Chamba", state: "Himachal Pradesh", latitude: 32.5530, longitude: 76.1260 },

  // ── Uttarakhand ────────────────────────────────────────
  { name: "Dehradun", district: "Dehradun", state: "Uttarakhand", latitude: 30.3165, longitude: 78.0322 },
  { name: "Haridwar", district: "Haridwar", state: "Uttarakhand", latitude: 29.9457, longitude: 78.1642 },
  { name: "Nainital", district: "Nainital", state: "Uttarakhand", latitude: 29.3816, longitude: 79.4498 },
  { name: "Mussoorie", district: "Dehradun", state: "Uttarakhand", latitude: 30.4598, longitude: 78.0644 },
  { name: "Rishikesh", district: "Dehradun", state: "Uttarakhand", latitude: 30.0869, longitude: 78.2676 },
  { name: "Chamoli (Gopeshwar)", district: "Chamoli", state: "Uttarakhand", latitude: 30.4060, longitude: 79.3200 },
  { name: "Uttarkashi", district: "Uttarkashi", state: "Uttarakhand", latitude: 30.7272, longitude: 78.4370 },

  // ── Jharkhand ──────────────────────────────────────────
  { name: "Ranchi", district: "Ranchi", state: "Jharkhand", latitude: 23.3441, longitude: 85.3096 },
  { name: "Jamshedpur", district: "East Singhbhum", state: "Jharkhand", latitude: 22.8046, longitude: 86.2029 },
  { name: "Dhanbad", district: "Dhanbad", state: "Jharkhand", latitude: 23.7957, longitude: 86.4304 },

  // ── Chhattisgarh ───────────────────────────────────────
  { name: "Raipur", district: "Raipur", state: "Chhattisgarh", latitude: 21.2514, longitude: 81.6296 },
  { name: "Bilaspur", district: "Bilaspur", state: "Chhattisgarh", latitude: 22.0797, longitude: 82.1409 },

  // ── Assam ──────────────────────────────────────────────
  { name: "Guwahati", district: "Kamrup Metro", state: "Assam", latitude: 26.1445, longitude: 91.7362 },
  { name: "Dibrugarh", district: "Dibrugarh", state: "Assam", latitude: 27.4728, longitude: 94.9120 },
  { name: "Silchar", district: "Cachar", state: "Assam", latitude: 24.8333, longitude: 92.7789 },

  // ── Northeast ──────────────────────────────────────────
  { name: "Imphal", district: "Imphal West", state: "Manipur", latitude: 24.8170, longitude: 93.9368 },
  { name: "Shillong", district: "East Khasi Hills", state: "Meghalaya", latitude: 25.5788, longitude: 91.8933 },
  { name: "Aizawl", district: "Aizawl", state: "Mizoram", latitude: 23.7271, longitude: 92.7176 },
  { name: "Kohima", district: "Kohima", state: "Nagaland", latitude: 25.6586, longitude: 94.1086 },
  { name: "Itanagar", district: "Papum Pare", state: "Arunachal Pradesh", latitude: 27.1044, longitude: 93.6920 },
  { name: "Agartala", district: "West Tripura", state: "Tripura", latitude: 23.8315, longitude: 91.2868 },

  // ── Goa ────────────────────────────────────────────────
  { name: "Panaji", district: "North Goa", state: "Goa", latitude: 15.4909, longitude: 73.8278 },
  { name: "Margao", district: "South Goa", state: "Goa", latitude: 15.2730, longitude: 73.9577 },

  // ── Uttarakhand hill stations & border ─────────────────
  { name: "Auli", district: "Chamoli", state: "Uttarakhand", latitude: 30.5280, longitude: 79.5670 },
  { name: "Lansdowne", district: "Pauri Garhwal", state: "Uttarakhand", latitude: 29.8389, longitude: 78.6854 },

  // ── Himachal Pradesh continued ─────────────────────────
  { name: "Spiti (Kaza)", district: "Lahaul Spiti", state: "Himachal Pradesh", latitude: 32.2230, longitude: 78.0030 },
  { name: "Keylong", district: "Lahaul Spiti", state: "Himachal Pradesh", latitude: 32.5700, longitude: 77.0370 },

  // ── Ladakh ─────────────────────────────────────────────
  { name: "Nubra Valley", district: "Leh", state: "Ladakh", latitude: 34.6800, longitude: 77.6000 },
  { name: "Pangong Lake", district: "Leh", state: "Ladakh", latitude: 33.7563, longitude: 78.6810 },

  // ── Kashmir ────────────────────────────────────────────
  { name: "Gulmarg", district: "Baramulla", state: "Jammu & Kashmir", latitude: 34.0484, longitude: 74.3802 },
  { name: "Pahalgam", district: "Anantnag", state: "Jammu & Kashmir", latitude: 34.0169, longitude: 75.3333 },
  { name: "Sonamarg", district: "Ganderbal", state: "Jammu & Kashmir", latitude: 34.3013, longitude: 75.2922 },
  { name: "Patnitop", district: "Udhampur", state: "Jammu & Kashmir", latitude: 32.9160, longitude: 75.3464 },

  // ── Common tourist / religious destinations ────────────
  { name: "Mount Abu", district: "Sirohi", state: "Rajasthan", latitude: 24.5926, longitude: 72.7156 },
  { name: "Rameshwaram", district: "Ramanathapuram", state: "Tamil Nadu", latitude: 9.2876, longitude: 79.3129 },
  { name: "Ooty", district: "Nilgiris", state: "Tamil Nadu", latitude: 11.4102, longitude: 76.6950 },
  { name: "Kodaikanal", district: "Dindigul", state: "Tamil Nadu", latitude: 10.2414, longitude: 77.4868 },
  { name: "Lonavala", district: "Pune", state: "Maharashtra", latitude: 18.7547, longitude: 73.4071 },
  { name: "Shirdi", district: "Ahmednagar", state: "Maharashtra", latitude: 19.7645, longitude: 74.4762 },
  { name: "Gangtok", district: "East Sikkim", state: "Sikkim", latitude: 27.3389, longitude: 88.6065 },
  { name: "Pelling", district: "West Sikkim", state: "Sikkim", latitude: 27.2944, longitude: 88.2406 },
  { name: "Tawang", district: "Tawang", state: "Arunachal Pradesh", latitude: 27.5867, longitude: 91.8657 },
  { name: "Cherrapunji", district: "East Khasi Hills", state: "Meghalaya", latitude: 25.2846, longitude: 91.7385 },
  { name: "Mawlynnong", district: "East Khasi Hills", state: "Meghalaya", latitude: 25.2000, longitude: 91.5800 },
  { name: "Dzukou Valley", district: "Kohima", state: "Nagaland", latitude: 25.6800, longitude: 94.0800 },
];

/** Fuzzy search for Indian cities — matches name, district, or state */
export function searchIndianCities(query: string): IndianCity[] {
  if (!query.trim()) return INDIAN_CITIES;
  const q = query.toLowerCase();
  return INDIAN_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(q) ||
      city.district.toLowerCase().includes(q) ||
      city.state.toLowerCase().includes(q)
  );
}

/** Convert IndianCity[] to LocationItem[] by adding sequential IDs */
export function toLocationItems(cities: IndianCity[]): (IndianCity & { id: number })[] {
  return cities.map((city, i) => ({ ...city, id: i + 1 }));
}
