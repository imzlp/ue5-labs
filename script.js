/* globals Docute */

new Docute({
  target: '#docute',
  sourcePath: './docs/',
  nav: [
    {
      title: 'Home',
      link: '/'
    }
  ],
  sidebar: [
    {
      title: 'Feeds',
      links: [
        {
          title: 'Z\'s Blog',
          link: 'https://imzlp.me/'
        },
        {
          title: 'UE4 Notes',
          link: 'https://imzlp.me/notes/ue'
        },
        {
          title: 'UE5 News',
          link: '/UE5'
        }
      ]
    }
  ]
})
