import React, { Component } from 'react';
import { ExternalComponent } from 'webpack-external-import';
import HelloWorld from './components/goodbye-world';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    import(/* webpackIgnore:true */'http://localhost:3002/importManifest.js').then(() => {
      this.setState({ manifestLoaded: true });
      import(/* webpackIgnore:true */`http://localhost:3002/${window.entryManifest['website-two']['SomeExternalModule.js']}`).then(() => {
        console.log('got module, will render it in 2 seconds');
        console.log(__webpack_require__('SomeExternalModule'));
        setTimeout(() => {
          this.setState({ loaded: true });
        }, 2000);
      });
    });
  }

  renderDynamic = () => {
    const { loaded } = this.state;
    if (!loaded) return null;
    return this.state.loaded && __webpack_require__('SomeExternalModule').default();
  }

  render() {
    const { manifestLoaded } = this.state;
    const helloWorldUrl = manifestLoaded && `http://localhost:3002/${window.entryManifest['website-two']['TitleComponent.js']}`;

    return (
      <div>
        <HelloWorld />
        { manifestLoaded && <ExternalComponent src={helloWorldUrl} module="TitleComponent" export="Title" title="Some Heading" />}
        {this.renderDynamic()}
      </div>
    );
  }
}

export default App;
