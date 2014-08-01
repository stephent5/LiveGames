@Code
    ViewData("Title") = "SignUp"
    
End Code

<div id="content">

		<div class="signuppanel">
            
            <div class="game-menu" style="border-radius:10px; -moz-border-radius:10px;">

			        <p><br/></p>

			        <h1>Sign in via Facebook to KickOff!</h1>

			        <p><br/></p>

			        <p>

			        &bull; Interact with a top Football match in realtime <br/>

			        &bull; Bet &amp; Win Credits <br/>

			        &bull; Compete against Friends <br/>

			        </p>

			        <p><br/></p>

			        <!-- --------------Facebook -->
			        <div id="fb-root"></div>

			  

			        <p><br/><login></login></p>

	        @*	    <fb:login-button autologoutlink="true" perms="email,user_birthday,status_update,publish_stream"></fb:login-button>*@
    	           @* <fb:login-button autologoutlink="true" perms="email,status_update,publish_stream"></fb:login-button>*@

                   <button id="fb-auth">Login</button>

                    <script type="text/javascript">
                        var button = document.getElementById('fb-auth');

                        button.innerHTML = 'Login';
                        button.onclick = function () 
                        {
                            FB.login(function (response) 
                            {
                                if (response.authResponse) 
                                {
                                    FB.api('/me', function (info) 
                                    {
                                        login(response, info);
                                    });
                                } 
                            }, 
                            { scope: 'email,status_update,publish_stream' });
                        }
                    </script>



			        <!-- --------------END Facebook -->

			        <p><br/></p>

			        <a href="#main">No thanks, Back to Main Menu &raquo;</a>

		    </div>

        </div>


</div> 