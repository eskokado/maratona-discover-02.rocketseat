const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    return res.render("profile", { profile: await Profile.get() });
  },

  async update(req, res) {
    const data = req.body;
    // definir quantas semanas tem num ano
    const weeksPerYear = 52;
    // remover as semanas de férias do ano, para pegar quantas semanas tem um mês
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
    // total de horas trabalhadas na semana
    const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
    // horas trabalhadas no mês
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;
    // qual o valor da minha hora ?
    const valueHour = data["monthly-budget"] / monthlyTotalHours;

    const profile = await Profile.get();

    Profile.update({
      ...profile,
      ...req.body,
      "value-hour": valueHour,
    });

    return res.redirect("/profile");
  },
};
