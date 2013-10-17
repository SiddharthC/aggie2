package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

	val loginForm = Form(
		tuple(
			"email"  -> text,
			"password" -> text
			) verifying ("Invalid email or password", result => result match {
	  			case (email, password) => User.authenticate(email, password).isDefined
			})
		)

	def login = Action { implicit request => 
		Ok(html.login(loginForm))
	}

	def index = Action {
		Redirect(routes.Application.signIn)
	}

	def signIn = TODO

}