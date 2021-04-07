﻿const Database = require("../db/config");

let data = [
  {
    id: 1,
    name: "Pizzaria Guloso",
    "daily-hours": 2,
    "total-hours": 60,
    created_at: Date.now(),
  },
  {
    id: 2,
    name: "OneTwo Project",
    "daily-hours": 3,
    "total-hours": 47,
    created_at: Date.now(),
  },
];

module.exports = {
  async get() {
    const db = await Database();
    const jobs = await db.all(`SELECT * FROM jobs`);
    await db.close();

    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      "daily-hours": job.daily_hours,
      "total-hours": job.total_hours,
      created_at: job.created_at,
    }));
  },
  update(jobId, updateJob) {
    data = data.map((job) => {
      if (Number(job.id) === Number(jobId)) {
        job = updateJob;
      }
      return job;
    });
  },
  delete(jobId) {
    data = data.filter((job) => Number(job.id) !== Number(jobId));
  },
  find(jobId) {
    return data.find((job) => Number(job.id) === Number(jobId));
  },
  create(newJob) {
    data.push(newJob);
  },
};
