import Hero from './Hero';
import TodayTasks from './TodayTasks';
import TodaySchedule from './TodaySchedule';
import LifeLogSummary from './LifeLogSummary';

export default function Overview() {
  return (
    <div>
      <Hero />
      <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8 pb-6 md:pb-8 grid grid-cols-12 gap-3 items-start">
        <div className="col-span-12 lg:col-span-7">
          <TodayTasks />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <TodaySchedule />
        </div>
        <div className="col-span-12">
          <LifeLogSummary />
        </div>
      </div>
    </div>
  );
}
