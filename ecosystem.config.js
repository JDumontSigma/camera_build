module.exports = {
  apps: [{
    name: 'camera_build',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-56-142-65.eu-west-2.compute.amazonaws.com',
      key: '/Users/jason.dumont/Desktop/goggleSite.pem',
      ref: 'origin/master',
      repo: 'git@github.com:JDumontSigma/camera_build.git',
      path: '/home/ubuntu/server',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
