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
          title: 'Business',
          link: '/Business'
        },
        {
          title: 'Technology',
          link: '/Technology'
        }
      ]
    }
  ]
})
