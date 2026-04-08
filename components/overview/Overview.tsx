import Hero from './Hero';
import TodayTasks from './TodayTasks';
import TodaySchedule from './TodaySchedule';
import LifeLogSummary from './LifeLogSummary';

export default function Overview() {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-10">
      <Hero />
      <div className="grid grid-cols-12 gap-2 md:gap-3 items-start">
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
