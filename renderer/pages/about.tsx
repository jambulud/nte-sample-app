import { Component, KeyboardEvent, ChangeEvent, createRef, RefObject, Fragment } from 'react'
import Layout from '../components/Layout';
import Renderer from '../services/renderer.service';

type KeyboardTarget = KeyboardEvent<HTMLInputElement> & { target: { value: string } };

export interface AboutState {
  previous: Array<{ cwd: string, cmd: string }>;
  input: string;
  cwd: string;
}

export default class About extends Component {

  state = {
    previous: [],
    input: '',
    cwd: null,
  }

  renderer: Renderer;
  textInput: RefObject<HTMLInputElement>;
  scrollAnchor: RefObject<HTMLInputElement>;

  constructor(props: {}) {
    super(props);
    this.renderer = new Renderer();
    this.textInput = createRef();
    this.scrollAnchor = createRef();
  }

  componentDidMount() {
    this.renderer.send('terminal/all-commands', 'cd').then(
      cwd => {
        this.setState({ cwd })
      }
    );
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: event.target.value })
  }

  /**
   * Sends a command to the node process. If it is a "cd" command 
   * the new current working directory is saved
   * 
   * @memberof About
   */
  handleSendCommand = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const inputClean = this.state.input.trim();
      const cwdClean = this.state.cwd.trim();
      const response = await this.renderer.send('terminal/all-commands', inputClean, cwdClean);

      let cwd = cwdClean;
      let message: { error?: string } | string = response;
      if (!response.error) {
        if (inputClean.startsWith('cd ')) {
          const resp = await this.renderer.send('terminal/all-commands', `${inputClean} && cd`, cwd);
          cwd = resp.toString().trim();
        }
      } else {
        message = response.error;
      }

      this.setState((prevState: Readonly<AboutState>) => {
        const executedInCwd = `${prevState.cwd}`;
        const executedCmd = `\$ ${prevState.input}\n${message}`;
        const previousCmd = { cwd: executedInCwd, cmd: executedCmd };
        const previous = [...prevState.previous, previousCmd];
        return { previous, input: '', cwd };
      }, this.scrollToBottom);
    }
  };

  focusTextInput = () => {
    this.textInput.current.focus();
  }

  scrollToBottom = () => {
    this.scrollAnchor.current.scrollIntoView({ behavior: 'smooth' });
  }

  displayCommand = (cwd: string, cmd: string) => {
    return (
      <Fragment>
        <pre className="terminal__path mb-0 color--green">{cwd}</pre>
        <pre className="terminal__command mt-0">{cmd}</pre>
        <style jsx>{`
          .terminal__command, .terminal__path {
            width: 100%;
            overflow-wrap: break-word;
            white-space: pre-wrap;
          }
          .color--green {
            color: #00FF66
          }

          .mb-0 {
            margin-bottom: 0;
          }

          .mt-0 {
            margin-top: 0;
          }
        `}
        </style>
      </Fragment>
    )
  }


  render() {
    return (
      <Layout>
        <p>This is the about page</p>
        <div className="terminal" onClick={this.focusTextInput}>
          <div className="terminal__previous">
            <pre>Hello this is a terminal</pre>
            {this.state.previous.map(prevCmd => this.displayCommand(prevCmd.cwd, prevCmd.cmd))}
          </div>
          <span className="font--console color--green">{this.state.cwd}</span><br />
          $ <input
            ref={this.textInput}
            value={this.state.input}
            className="terminal__input font--console"
            placeholder="write your command"
            onChange={this.handleChange}
            onKeyDown={this.handleSendCommand} />
          <div ref={this.scrollAnchor}></div>
        </div>
        <style jsx>{`
          h1 {
            color: green;
            font-size: 50px;
          }

          .terminal {
            padding: 16px;
            border: solid 2px gray;
            height: 300px;
            width: 80%;
            max-width: 1000px;
            background-color: #333;
            color: white;
            overflow-y: auto;
          }

          .terminal__input {
            background-color: inherit;
            border: none;
            caret-color: white;
            color: inherit;
            width: calc(100% - 1rem);
          }

          .terminal__input:focus {
            outline-width: 0;
          }

          .terminal__command, .terminal__path {
            width: 100%;
            overflow-wrap: break-word;
            white-space: pre-wrap;
          }

          .terminal__path {
            color: #00FF66
          }

          .font--console {
            font-family: monospace,monospace;
            font-size:0.8125rem;
          }

          .color--green {
            color: #00FF66
          }
        `}
        </style>

      </Layout>
    );
  };
}