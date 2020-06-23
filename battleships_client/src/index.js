import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import { GameFriend, Home, GameBot, NotFound } from './pages';
import './index.css';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/game/bot' component={GameBot} />
                <Route path='/game/:id' component={GameFriend} />
                <Route component={NotFound} />
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
