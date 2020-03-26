// ref: https://umijs.org/config/
export default {
  history: 'hash',
  treeShaking: true,
  publicPath: './',
  outputPath: './dist/renderer',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'Limelight Finder',
        dll: true,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  lessLoaderOptions: {
    modifyVars: {
      hack: `true; @import "~antd/lib/style/themes/default.less";`,
      '@layout-header-height ': '32px',
      '@layout-header-background ': '#333',
      '@layout-body-background ': '#222',
      '@layout-trigger-background ': '#333',
      '@menu-collapsed-width ': '50px',
      '@primary-color ': '#66bf0d',
      '@limelightInputBG': '#191919',
      '@component-background': '@limelightInputBG',
      '@body-background': '#fff',
      '@heading-color': '@heading-color-dark',
      '@text-color': '@text-color-dark',
      '@text-color-secondary': '@text-color-secondary-dark',
      '@input-bg': '@limelightInputBG',
      '@background-color-light': '#555',
      '@background-color-base': '#555',
      '@border-color-base': '#000',
      '@btn-default-bg': '@limelightInputBG',
      '@icon-url ': '"/fonts/font_148784_v4ggb6wrjmkotj4i"',

      '@table-selected-row-bg': '#333',
      '@table-row-hover-bg': '#555',
    },
  },
};
