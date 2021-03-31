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
  },

  controllers: {
    index (req, res) {
      return res.render(views + "profile", { profile: Profile.data })
    },

    update (req, res) {
      const data = req.body
      // definir quantas semanas tem num ano
      const weeksPerYear = 52
      // remover as semanas de férias do ano, para pegar quantas semanas tem um mês
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12
      // total de horas trabalhadas na semana
      const weekTotalHours = data["hours-per-day"] * data["days-per-week"]
      // horas trabalhadas no mês
      const monthlyTotalHours = weekTotalHours * weeksPerMonth
      // qual o valor da minha hora ?
      const valueHour = data["monthly-budget"] / monthlyTotalHours

      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour
      }

      return res.redirect('/profile')

    }
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
          budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
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

    show (req, res) {

      const jobId = req.params.id

      const job = Job.data.find((job) => Number(job.id) === Number(jobId))

      if (!job) {
        return res.send('Job not found')
      }

      job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

      return res.render(views + "job-edit", { job })
    },

    update (req, res) {

      const jobId = req.params.id

      const job = Job.data.find((job) => Number(job.id) === Number(jobId))

      if (!job) {
        return res.send('Job not found')
      }

      const updateJob = {
        ...job,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
      }

      Job.data = Job.data.map(job => {
        if (Number(job.id) === Number(jobId)) {
          job = updateJob
        }
        return job
      })

      return res.redirect('/job/' + jobId)
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
    },
    calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
  }
}

routes.get('/', Job.controllers.index)

routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes