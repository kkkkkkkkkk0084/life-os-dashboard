import Hero from './Hero';
import TodayTasks from './TodayTasks';
import TodaySchedule from './TodaySchedule';
import LifeLogSummary from './LifeLogSummary';

export default function Overview() {
  return (
    <div className="h-[calc(100dvh-88px)] flex flex-col overflow-hidden">
      <Hero />
      <div className="flex-1 min-h-0 max-w-[1280px] w-full mx-auto px-8 pb-6 grid grid-cols-12 gap-3 grid-rows-[1fr_auto]">
        <div className="col-span-12 lg:col-span-7 min-h-0">
          <TodayTasks />
        </div>
        <div className="col-span-12 lg:col-span-5 min-h-0">
          <TodaySchedule />
        </div>
        <div className="col-span-12">
          <LifeLogSummary />
        </div>
      </div>
    </div>
  );
}
