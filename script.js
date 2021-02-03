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
          title: 'UE4',
          link: 'https://imzlp.me/notes/ue'
        },
        {
          title: 'UE5',
          link: '/UE5'
        }
      ]
    }
  ]
})
