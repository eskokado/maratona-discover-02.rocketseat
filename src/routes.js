const express = require('express')
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
  data: {
    name: "Jakeliny",
    avatar: "https://avatars.githubusercontent.com/u/17316392?s=460&u=6912a91a70bc89745a2079fdcdad3bc3ce370f13&v=4",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour": 75
  }
}

const Job = {
  data: [
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
    }
  ],

  controllers: {
    index (req, res) {
      const updateJobs = Job.data.map((job) => {
        const remaining = Job.services.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'

        return {
          ...job,
          remaining,
          status,
          budget: Profile.data["value-hour"] * job["total-hours"]
        }
      })
      return res.render(views + "index", { jobs: updateJobs })
    },

    create (req, res) {
      return res.render(views + "job")
    },

    save (req, res) {
      const jobId = Job.data[Job.data.length - 1]?.id || 0

      Job.data.push({
        id: jobId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now()
      })

      return res.redirect('/')
    },
  },

  services: {
    remainingDays (job) {
      // ajustes no job
      // cálculo de tempo restantes
      const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()

      const createdDate = new Date(job.created_at)
      const dueDay = createdDate.getDate() + Number(remainingDays)
      const dueDateInMs = createdDate.setDate(dueDay)

      const timeDiffInMs = dueDateInMs - Date.now()

      // Transforma mili em days
      const dayInMs = 1000 * 60 * 60 * 24
      const dayDiff = Math.floor(timeDiffInMs / dayInMs)
      return dayDiff
    }
  }
}

routes.get('/', Job.controllers.index)

routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', (req, res) => res.render(views + "profile", { profile: Profile.data }))

module.exports = routes