import Hero from './Hero';
import TodayTasks from './TodayTasks';
import TodaySchedule from './TodaySchedule';
import LifeLogSummary from './LifeLogSummary';

export default function Overview() {
  return (
    <div>
      <Hero />
      <div className="max-w-5xl w-full mx-auto px-5 md:px-8 pb-5 md:pb-6 grid grid-cols-12 gap-2 md:gap-3 items-start">
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
