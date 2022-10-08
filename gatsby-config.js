module.exports = {
  siteMetadata: {
    title: `Andrija Perušić`,
    description: `View Andrija Perušić's website, explore and connect!`,
    author: `Andrija Perušić`,
    siteUrl: `https://andrijaperusic.com`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Andrija Perušić's website`,
        short_name: `Andrija website`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Rubik\:400,500,700`,
          `Noto Sans\:400`,
        ],
        display: 'swap'
      }
    },
    `gatsby-plugin-sass`,
  ],
}
