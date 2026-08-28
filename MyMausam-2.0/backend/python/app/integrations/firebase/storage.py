class FirebaseStorageClient:
    async def upload_file(self, local_path: str, remote_path: str) -> str:
        return f"https://storage.googleapis.com/mymausam-uploads/{remote_path}"

firebase_storage_client = FirebaseStorageClient()
