const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  create(req, res) {
    return res.render("job");
  },

  async save(req, res) {
    await Job.create({
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(),
    });

    return res.redirect("/");
  },

  async show(req, res) {
    const jobId = req.params.id;
    const profile = await Profile.get();

    const job = await Job.find(jobId);

    if (!job) {
      return res.send("Job not found");
    }

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },

  async update(req, res) {
    const jobId = req.params.id;

    const job = await Job.find(jobId);

    if (!job) {
      return res.send("Job not found");
    }

    const updateJob = {
      ...job,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
    };

    await Job.update(jobId, updateJob);

    return res.redirect("/job/" + jobId);
  },

  delete(req, res) {
    const jobId = req.params.id;

    Job.delete(jobId);

    return res.redirect("/");
  },
};
