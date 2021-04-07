const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    const jobs = Job.get();
    const profile = await Profile.get();

    const statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    // total de horas por dia de cada Job em progresso
    let jobTotalHours = 0;

    const updateJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      jobTotalHours += status === "progress" ? job["daily-hours"] : 0;

      statusCount[status] += 1;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    // qtd de horas que quero trabalhar (PROFILE)
    // MENOS
    // qtd de horas/dias de cada job em progresso
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updateJobs,
      profile,
      statusCount,
      freeHours,
    });
  },
};
