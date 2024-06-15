"""Used to make custom errors"""

class MultipleRecordsFoundError(Exception):
    def __init__(self, key, value):
        self.uid = uid
        self.message = f"Multiple records found with {key}: {value}"
        super().__init__(self.message)
