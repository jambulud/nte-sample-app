import { Component } from 'react'
import { IpcRendererEvent } from 'electron';
import Spawned from '../components/Spawned';
import Renderer from '../services/renderer.service';

class HelloElectron extends Component {
  state = {
    input: '',
    message: null,
    spawnMessage: null,
  }

  renderer: Renderer;

  constructor(props: {}) {
    super(props);
    this.renderer = new Renderer();
  }

  componentDidMount() {
    // start listening the channel message
    this.renderer.on('message', this.handleMessage)
    this.renderer.on('terminal:spawn-ls', this.handleSpawnMessage);
  }

  componentWillUnmount() {
    // stop listening the channel message
    this.renderer.removeAll();
  }

  handleMessage = (_: IpcRendererEvent, message: string) => {
    // receive a message from the main process and save it in the local state
    this.setState({ message })
  }

  handleSpawnMessage = (_: IpcRendererEvent, spawnMessage: string) => {
    // receive a message from the main process and save it in the local state
    this.setState({ spawnMessage })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: event.target.value })
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.renderer.send('message', this.state.input)
    this.setState({ message: null })
  }

  handleSpawn = () => {
    this.renderer.send('terminal:spawn-ls', this.state.input)
  }

  render() {
    return (
      <Spawned
        message={this.state.message}
        spawnMessage={this.state.spawnMessage}
        handleSpawnMessage={this.handleSpawn}
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}>
      </Spawned>
    );
  }
}

export default HelloElectron;