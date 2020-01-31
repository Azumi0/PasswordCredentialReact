class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    if (!window.PasswordCredential) {
      throw new Error('Your browser does not support PasswordCredential');
    }

    this.state = {
      user: null,
      nameFormValue: '',
      emailFormValue: '',
      passwordFormValue: '',
    };
    this.logUser = this.logUser.bind(this);
    this.signOut = this.signOut.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
  }

  componentDidMount() {
    navigator.credentials.get({
      password: true,
      mediation: 'silent'
    }).then(cred => {
      if (cred) {
        console.log('auto sign-in performed');
        console.log('Got Credentials', cred);

        this.setState({
          user: cred,
        });
      }
    });
  }

  logUser(event) {
    event.preventDefault();
    const { nameFormValue, emailFormValue, passwordFormValue } = this.state;
    const cred = new PasswordCredential({
      name: nameFormValue,
      id: emailFormValue,
      password: passwordFormValue,
    });

    navigator.credentials.store(cred).then(() => {
      console.log('StoredCredentials', cred);
      this.setState({
        user: cred,
      });
    });
  }

  signOut(event) {
    event.preventDefault();
    const { user } = this.state;

    navigator.credentials.preventSilentAccess().then(() => {
      console.log('Logged out');
      this.setState({
        user: null,
      });
    });
  }

  setInputValue(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {

    const { user, nameFormValue, emailFormValue, passwordFormValue } = this.state;

    if (user !== null) {
      return (
        <div className="row">
          <div className="col">
            <h2 className="text-center">{`You are logged in! Welcome ${user.name}, ${user.id}`}</h2>
          </div>
          <div className="col">
            <button type="button" className="btn btn-primary" onClick={this.signOut}>Sign out</button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={this.logUser}>
        <div className="form-group">
          <label htmlFor="nameInput">Your name:</label>
          <input id="nameInput" className="form-control" type="text" required value={nameFormValue} name="nameFormValue" onChange={this.setInputValue} />
        </div>
        <div className="form-group">
          <label htmlFor="emailInput">Your e-mail:</label>
          <input id="emailInput" className="form-control" type="email" required value={emailFormValue} name="emailFormValue" onChange={this.setInputValue} />
        </div>
        <div className="form-group">
          <label htmlFor="passwordInput">Your password:</label>
          <input id="passwordInput" className="form-control" type="password" required value={passwordFormValue} name="passwordFormValue" onChange={this.setInputValue} />
        </div>
        <button type="submit" className="btn btn-primary">Sign in</button>
      </form>
    );
  }
}


ReactDOM.render(
  <LoginForm/>,
  document.getElementById('react-content'),
);
