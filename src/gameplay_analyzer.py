class GameplayAnalyzer:

    def __init__(self):
        self.features = {}

    def add_feature(self, name, value):
        self.features[name] = value

    def get_features(self):
        return self.features