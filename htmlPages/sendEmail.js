module.exports = {

    htmlContent: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Congratulations</title>
    </head>
    
    <body>
        <h1> Congratulations! You have successfully created an account </h1>
    </body>
    
    </html>`,

    SendCode:function(code){

    return (`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Code</title>
    </head>
    
    <body>
        <p> Ue this code to reset your password: <b> ${code} </b> </p>
    </body>
    
    </html>`)
}


}