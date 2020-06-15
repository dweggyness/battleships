import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import { Game, Home } from './pages';
import './index.css';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/game/:id' component={Game} />
                <Route render={() => <h1>404 You are not supposed to see this! 404</h1>} />
            </Switch>
        </Router>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <div>
            <App />
        </div>
    </React.StrictMode>,
    document.getElementById('root'),
);
