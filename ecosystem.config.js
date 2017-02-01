module.exports = {
  apps: [{
    name: 'camera_emulator',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-56-44-196.eu-west-2.compute.amazonaws.com',
      key: '~/Desktop/goggleSite.pem',
      ref: 'origin/master',
      repo: 'git@github.com:JasonDumont/camera_emulator.git',
      path: '/home/ubuntu/camera_emulator',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
