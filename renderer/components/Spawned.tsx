import { Component, ChangeEvent, MouseEvent, FormEvent } from 'react'
import Layout from './Layout';

interface CustomProps {
    handleSpawnMessage: (event: MouseEvent) => void,
    handleChange: (event: ChangeEvent) => void,
    handleSubmit: (event: FormEvent) => void,
    message: string,
    spawnMessage: string,
}

class DisplayRes extends Component<CustomProps>{

    constructor(props: CustomProps) {
        super(props);
    }


    render() {

        return (
            <Layout>
                <h1>Hello Electron!</h1>

                <button onClick={this.props.handleSpawnMessage}>Spawn ls</button>

                {this.props.message && <p>{this.props.message}</p>}

                Spawn message: <br />{this.props.spawnMessage}

                <form onSubmit={this.props.handleSubmit}>
                    <input type="text" onChange={this.props.handleChange} />
                </form>
                <style jsx>{`
            h1 {
              color: green;
              font-size: 50px;
            }
          `}</style>
            </Layout>
        )
    }
}

export default DisplayRes;