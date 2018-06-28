import React, { Component } from 'react';
import ExtendedWidget from './ExtendedWidget';
import Widget from '@wso2-dashboards/widget';
import VizG from 'react-vizgrammar';
import Axios from 'axios';

const COOKIE = 'DASHBOARD_USER';

class HelloWorld extends Widget {
    constructor(props) {
         super(props);


    this.tableConfig = {
                     "charts": [
                         {
                             "type": "table",
                             "columns": [
                                 {
                                     "name": "EngineType",
                                     "title": "EngineType",
                                     "colorBasedStyle": true
                                 },
                                 {
                                     "name": "torque",
                                     "title": "Engine Torque"
                                 },
                                 {
                                     "name": "rpm",
                                     "title": "Engine RPM",
                                     "colorBasedStyle": true,
                                     "colorScale": [
                                         "red"
                                     ]
                                 }
                             ]
                         }
                     ],
                     "maxLength": 7,
                     "colorBasedStyle": true,
                     "pagination": true
                 };

    this.metadata = {
                 "names": [
                     "rpm",
                     "torque",
                     "horsepower",
                     "EngineType"
                 ],
                 "types": [
                     "linear",
                     "linear",
                     "ordinal",
                     "ordinal"
                 ]
             };

    this.state = {
                id: props.id,
                data: [
                 [0, 10, 1, 'Piston'],
                ],
                config: null,
                dataProviderConf: ""
            };
//                console.log("props")
//                console.log(props)
            this.handleWidgetData = this.handleWidgetData.bind(this);
    }

    componentDidMount() {
            console.log("CompDidMount Called ..")
            let httpClient = Axios.create({
                baseURL: window.location.origin + window.contextPath,
                timeout: 2000,
                headers: {"Authorization": "Bearer " + HelloWorld.getUserCookie().SDID},
            });

            httpClient.defaults.headers.post['Content-Type'] = 'application/json';
            httpClient
                .get(`/apis/widgets/${this.props.widgetID}`)
                .then((message) => {
                    console.log("***** widget channel manager- Response")
                    console.log(message)

                    try{

                    super.getWidgetChannelManager().subscribeWidget(this.props.id,this.handleWidgetData,message.data.configs.providerConfig)

                    }
                    catch(e){
                    console.log("error")
                    console.log(e)
                    }
//                    console.log("dataaaaa")
//                    console.log(message.data)

                })
                .catch((error) => {
                    // TODO Handle Error
                });
        }

    static getUserCookie() {
                const arr = document.cookie.split(';');
                for (let i = 0; i < arr.length; i++) {
                    let c = arr[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(COOKIE) === 0) {
                        return JSON.parse(c.substring(COOKIE.length + 1, c.length));
                    }
                }
                return null;
            }

    handleWidgetData(data) {
    console.log("handle widget data")
    console.log(data.data)
        this.setState({
            data: data.data
        })
    }

    render() {
    console.log("AAA")
    console.log(this.tableConfig)
    console.log(this.state.data)
//    console.log(this.metadata)
        return (
                <VizG config={this.tableConfig} data={this.state.data} metadata={this.metadata} onClick={this.handleData} />
        );
    }

    handleData(row) {
        //Add the data handling logic here
        console.info(row);
    }
}

global.dashboard.registerWidget('HelloWorld', HelloWorld); //(widgetId,reactComponent)