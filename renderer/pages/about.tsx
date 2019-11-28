import { Component, KeyboardEvent, ChangeEvent, createRef, RefObject } from 'react'
import Layout from '../components/Layout';
import Renderer from '../services/renderer.service';

type KeyboardTarget = KeyboardEvent<HTMLInputElement> & { target: { value: string } };

export interface AboutState {
  previous: Array<string>;
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

  constructor(props: {}) {
    super(props);
    this.renderer = new Renderer();
    this.textInput = createRef();
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
        if (this.state.input.startsWith('cd ')) {
          cwd = inputClean.replace('cd ', '');
          const resp = await this.renderer.send('terminal/all-commands', 'cd', cwd);
          cwd = resp.toString().trim();
        }
      } else {
        message = response.error;
      }

      this.setState((prevState: Readonly<AboutState>) => {
        const executedCmd = `${prevState.cwd}\n\$ ${prevState.input}\n${message}`;
        const previous = [...prevState.previous, executedCmd];
        return { previous, input: '', cwd };
      });

    }
  };

  focusTextInput = () => {
    this.textInput.current.focus();
  }


  render() {
    return (
      <Layout>
        <p>This is the about page</p>
        <div className="terminal" onClick={this.focusTextInput}>
          <div className="terminal__previous">
            <pre>Hello this is a terminal</pre>
            {this.state.previous.map(prevCommand => <pre className="terminal__command">{prevCommand}</pre>)}
          </div>
          <span className="font--console">{this.state.cwd}</span>$ <input
            ref={this.textInput}
            value={this.state.input}
            className="terminal__input font--console"
            placeholder="write your command"
            onChange={this.handleChange}
            onKeyDown={this.handleSendCommand} />
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
          }

          .terminal__input:focus {
            outline-width: 0;
          }

          .terminal__command {
            width: 100%;
            overflow-wrap: break-word;
            white-space: pre-wrap;
          }

          .font--console {
            font-family: monospace,monospace;
            font-size:0.8125rem;
          }
        `}
        </style>
      </Layout>
    );
  };
}