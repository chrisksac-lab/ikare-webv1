export function validateMTN(tel)
{
    var error;
    const firstDigits = parseInt(tel.substring(1, 3)) 
    if(tel.substring(0,1) != "6")
        error = true;
    else {
        if (firstDigits >= 50 && firstDigits <= 54) 
        error = false;
        else if(firstDigits >= 70 && firstDigits < 90)
        error = false;
        else
        error = true;
    }
    return error;
}

export function validateOrange(tel)
{
    var error;
    const firstDigits = parseInt(tel.substring(1, 3)) 
    if(tel.substring(0,1) != "6")
        error = true;
    else {
    switch(true)
    {
        case (firstDigits >= 55 && firstDigits < 60): 
        error = false;
        break;
        case (firstDigits >= 90 && firstDigits <= 99):
        error = false;
        break;
        default :
        error = true;
        }
    }
    return error;
}

export function validateCamtel(tel)
{
    var error;
    const firstDigits = parseInt(tel.substring(1, 3)) 
    if(tel.substring(0,1) != "6")
    error = true;
    else {
    switch(true){
    case (firstDigits >= 20 && firstDigits < 30): 
    error = false;
    break;
    // case (firstDigits >= 90 && firstDigits <= 99):
    // error = false;
    // break;
    default :
    error = true;
    }
}
return error;   
}