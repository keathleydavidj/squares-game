// import xs from 'xstream'
import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import 'snabbdom-jsx'

// main
function main(sources: any) {
    const sinks = {
        DOM: sources.DOM.select('input').events('click')
            .map((ev: {target: {checked: boolean}}) => ev.target.checked)
            .startWith(false)
            .map((toggled: boolean) =>
                <div>
                    <input type="checkbox" /> Toggle Me
                    <p>{toggled ? 'ON' : 'off'}</p>
                </div>
            )
    }
    return sinks
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

run(main, drivers)