package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._

import models._
import views._

object Application extends Controller {

	// Login
	// val loginForm = Form(
	// 	tuple(
	// 		"email"  -> text,
	// 		"password" -> text
	// 		) verifying ("Invalid email or password", result => result match {
	//   			case (email, password) => User.authenticate(email, password).isDefined
	// 		})
	// 	)

	// def login = Action { implicit request => 
	// 	Ok(html.login(loginForm))
	// }

	// def authenticate = Action { implicit request =>
 //    	loginForm.bindFromRequest.fold(
 //      formWithErrors => BadRequest(html.login(formWithErrors)),
 //      user => Redirect(routes.Projects.index).withSession("email" -> user._1)
 //    )
 //  	}
 //  def logout = Action {
 //    Redirect(routes.Application.login).withNewSession.flashing(
 //      "success" -> "You've been logged out"
 //    )
 //  }

	def index = Action {
		Redirect(routes.Application.signIn)
	}

	def signIn = TODO

}