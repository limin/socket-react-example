import React, { Component } from 'react'
import {hot} from 'react-hot-loader'
import update from 'immutability-helper'
import '../node_modules/bulma/css/bulma.css'
import './App.css'

function randomstr(len){
  const s = [];
  const chars="abcdefghijklmnopqrstuvwxyz"
  for(var i = 0; i < len; i++) {
    s.push(chars.charAt(Math.floor(Math.random() * chars.length)))
  }
  return s.join('')
}

function hashcode(str) {
  var hash = 0
  if (str.length === 0) {
      return hash
  }
  for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash<<5)-hash)+char
      hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

function randomId(len=6){
  let rdm=Math.random().toString(36).substr(2,len)
  for(let i=0;i<len-rdm.length;i++){
      rdm='0'+rdm
  }
  return rdm
}

function uniqueId(len=10){
  //it's 7 chars
  const timestamp=Date.now().toString(36)
  let rdmLen=len-timestamp.length
  //default 10 chars
  const rdm=randomId(rdmLen>0?rdmLen:3)
  return `${timestamp}${rdm}`
}


class App extends Component {
  state={
    form:{username:randomstr(6),password:"password",data:""},
    user:null,
    events:[]
  }
  
  login(){
    const socket=this.props.socket
    const user={username:this.state.form.username}
    if(user.username.length>=3){
      const id=[socket.id,uniqueId()].join("-")      
      const event={id,user,type:"user connected",timestamp:Date.now()}
      socket.emit(event.type, event);          
      this.setState(update(this.state,{user:{$set:user},events:{$push:[event]}}))
    }
  }

  send(){
    const socket=this.props.socket
    const data=this.state.form.data
    const user=this.state.user
    if(data.length>0){
      const id=[socket.id,uniqueId()].join("-")      
      const event={id,user,data,type:"send data",timestamp:Date.now()}      
      socket.emit(event.type, event)          
      this.setState(update(this.state,{user:{$set:user},events:{$push:[event]}}))
    }
  }  

  event2string(event){
    switch(event.type){
      case "user connected":
        return `${event.user.username} connected`
      case "user disconnected":
        return `${event.user.username} disconnected`
      case "send data":
        return `${event.user.username} send data:${JSON.stringify(event.data)}`
      default:
        return
    }
  }
  componentDidMount() {      
    const socket=this.props.socket
    socket.on('user connected', (event) => {
      this.setState(update(this.state,{events:{$push:[event]}}))      
    })

    socket.on('send data', (event) => {
      this.state.user && this.setState(update(this.state,{events:{$push:[event]}}))      
    })

    socket.on('disconnect', () => {
      const user=this.state.user
      if(user){
        const id=[socket.id,uniqueId()].join("-")
        const event={id,user,type:"user disconnected",timestamp:Date.now()}      
        socket.emit(event.type, event)          
        this.setState(update(this.state,{user:{$set:null},events:{$push:[event]}}))  
      }
    })
  }

  item(event){
    return(
      <li className="media" key={event.id}>
        <div className="media-left">
          <p className="image is-64x64">
            <img alt={event.user.username} src={`https://randomuser.me/api/portraits/lego/${Math.abs(hashcode(event.user.username)%10)}.jpg`}/>
          </p>
        </div>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{event.user.username}</strong> <small>@{new Date(event.timestamp).toString()}</small>
              <br/>
              {this.event2string(event)}
            </p>
          </div>
        </div>
      </li>      
    )
  }
  render() {
    return (
      <section className="section">
        <div className="container">      
          <ul>
          {
            this.state.events.map(event=>this.item(event))        
          }
          </ul>
          <br/>
          <div className="field">
            <div className="control">
              <textarea class="textarea" placeholder="{temperature:30, humidity:80%, timestamp: 1538016586}" onChange={(e)=>this.setState(update(this.state,{form:{data:{$set:e.target.value}}}))}>{this.state.form.data}</textarea>            
            </div>
          </div>   
          <div className="field is-grouped">
            <div className="control">
              <a className="button is-link" onClick={e=>this.send()}>Send</a>
            </div>
          </div>
          {!this.state.user && <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Login</p>
              </header>
              <section className="modal-card-body">              
                <div className="field">
                  <div className="control">
                    <input className="input is-focused" value={this.state.form.username} type="text" placeholder="Username" onChange={(e)=>this.setState(update(this.state,{form:{username:{$set:e.target.value}}}))}/>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <input className="input" type="password" placeholder="Password"  value={this.state.form.password}  onChange={(e)=>this.setState(update(this.state,{form:{password:{$set:e.target.value}}}))}/>
                  </div>
                </div>                                
              </section>
              <footer className="modal-card-foot">
                <button className="button is-success" onClick={(e)=>this.login()}>Submit</button>
              </footer>
            </div>
          </div>          
          }
        </div>
      </section>      
    );
  }
}

export default hot(module)(App)
