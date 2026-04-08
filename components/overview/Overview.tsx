import Hero from './Hero';
import TodayTasks from './TodayTasks';
import TodaySchedule from './TodaySchedule';
import LifeLogSummary from './LifeLogSummary';

export default function Overview() {
  return (
    <div>
      <Hero />
      <div className="max-w-[1280px] mx-auto px-8 pb-8 grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-7 min-h-[280px]">
          <TodayTasks />
        </div>
        <div className="col-span-12 lg:col-span-5 min-h-[280px]">
          <TodaySchedule />
        </div>
        <div className="col-span-12">
          <LifeLogSummary />
        </div>
      </div>
    </div>
  );
}
