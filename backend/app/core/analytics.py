from posthog import Posthog


class PosthogAnalytics:
    def __init__(self, posthog: Posthog):
        self.posthog = posthog

    def track_event(self, uid: str | None, event_name: str, properties: dict = None):
        if not self.posthog:
            return
        if not uid:
            properties["$process_person_profile"] = False
            uid = "anonymous"
        self.posthog.capture(uid, event_name, properties)
