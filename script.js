/* globals Docute */

new Docute({
  target: '#docute',
  sourcePath: './docs/',
  nav: [
    {
      title: 'Home',
      link: '/'
    },
    {
      title: 'Blog',
      link: 'https://imzlp.me/'
    },
    {
      title: 'Github',
      link: 'http://github.com/hxhb'
    }
  ],
  sidebar: [
    {
      title: 'Feeds',
      links: [
        {
          title: 'UE5 News',
          link: '/UE5'
        },
        {
          title: 'UE4 Notes',
          link: 'https://imzlp.me/notes/ue'
        }
      ]
    }
  ]
})
