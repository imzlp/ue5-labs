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
      title: 'MyBlog',
      link: 'https://imzlp.com/'
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
          link: 'https://imzlp.com/notes/ue'
        }
      ]
    }
  ]
})
