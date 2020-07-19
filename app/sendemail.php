<?php

   //echo $_POST['name'];

    //	header('Content-type: application/json');

   //	$status = array(
   //		'type'=>'success',
   //		'message'=>'Thank you for contacting us. We will contact you at our earliest.'
    //	);

    
    $name = @trim(stripslashes($_POST['name'])); 
    $email = @trim(stripslashes($_POST['email'])); 
    $subject = @trim(stripslashes($_POST['subject'])); 
    $message = @trim(stripslashes($_POST['message']));
    $phoneno = @trim(stripslashes($_POST['phoneno']));
    $companyname = @trim(stripslashes($_POST['companyname'])); 

    $email_from = 'techspatio@gmail.com';
    $email_to = 'techspatio@gmail.com';

    $body = 'Name: ' . $name . "\n\n" . 'Email: ' . $email . "\n\n" . 'Subject: ' . $subject . "\n\n" . 'Message: ' . $message . "\n\n" . 'Phone No: ' . $phoneno . "\n\n" . 'Company Name: ' . $companyname;

    $success = @mail($email_to, $subject, $body, 'From: <'.$email_from.'>');

   //    echo json_encode($status);
    echo "Thanks! We will get back to you.";
    
    die;
   
?>
