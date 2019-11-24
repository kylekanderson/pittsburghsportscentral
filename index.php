<!-- This file is used for Heroku integration
Because Heroku doesn't provide a static HTML/CSS/JS buildpack, this file causes it to use a PHP buildpack -->
<?php header( 'Location: /public/html/index.html' ) ;  ?>