const Database = require("../db/config");

let data = {
  name: "Jakeliny",
  avatar:
    "https://avatars.githubusercontent.com/u/17316392?s=460&u=6912a91a70bc89745a2079fdcdad3bc3ce370f13&v=4",
  "monthly-budget": 3000,
  "hours-per-day": 5,
  "days-per-week": 5,
  "vacation-per-year": 4,
  "value-hour": 75,
};

module.exports = {
  async get() {
    const db = await Database();

    const data = await db.get(`SELECT * FROM profile`);

    await db.close();

    return {
      name: data.name,
      avatar: data.avatar,
      "monthly-budget": data.monthly_budget,
      "days-per-week": data.days_per_week,
      "hours-per-day": data.hours_per_day,
      vocation_per_year: data.vocation_per_year,
      "value-hour": data.value_hour,
    };
  },
  update(newData) {
    data = newData;
  },
};
