const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function stopDatabase() {
  const { stdout, stderr } = await exec("sudo /etc/init.d/mongodb stop");
  console.log("stdout:", stdout);
  console.log("stderr:", stderr);
}
async function startDatabase() {
  const { stdout, stderr } = await exec("sudo service mongodb start");
  console.log("stdout:", stdout);
  console.log("stderr:", stderr);
}
// stopDatabase();
// startDatabase();

// exec("sudo /etc/init.d/mongodb stop");
exec("sudo service mongodb stop")
  .then(() => {
    console.log("stopppp");
  })
  .catch(err => {
    console.log(err);
  });
exec("sudo service mongodb start");
