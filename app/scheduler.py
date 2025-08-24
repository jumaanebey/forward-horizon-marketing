from apscheduler.schedulers.background import BackgroundScheduler
from typing import Callable


class NudgeScheduler:
    def __init__(self, tick: Callable[[], None]) -> None:
        self.scheduler = BackgroundScheduler()
        self.tick = tick

    def start(self) -> None:
        # run every minute
        self.scheduler.add_job(self.tick, 'interval', minutes=1, id='nudge_tick', replace_existing=True)
        self.scheduler.start()

    def shutdown(self) -> None:
        self.scheduler.shutdown(wait=False)