import { Component, KeyboardEvent, ChangeEvent, createRef, RefObject } from 'react'
import Layout from '../components/Layout';
import Renderer from '../services/renderer.service';

type KeyboardTarget = KeyboardEvent<HTMLInputElement> & { target: { value: string } };

export interface AboutState {
  previous: Array<string>;
  input: string;
}

export default class About extends Component {

  state = {
    previous: [],
    input: '',
  }

  renderer: Renderer;
  textInput: RefObject<HTMLInputElement>;

  constructor(props: {}) {
    super(props);
    this.renderer = new Renderer();
    this.textInput = createRef();
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: event.target.value })
  }

  handleSendCommand = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const message = await this.renderer.send('terminal/all-commands', this.state.input)

      this.setState((prevState: Readonly<AboutState>) => {
        const previous = [...prevState.previous, prevState.input, message];
        return { previous, input: '' };
      });
    }
  };

  focusTextInput = () => {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
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
          $ <input
            ref={this.textInput}
            value={this.state.input}
            className="terminal__input"
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
        `}
        </style>
      </Layout>
    );
  };
}