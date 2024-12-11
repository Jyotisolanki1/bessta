(function () {
  const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

  //I'm adding this section so I don't have to keep updating this pen every year :-)
  //remove this if you don't need it
  let today = new Date(),
      dd = String(today.getDate()).padStart(2, "0"),
      mm = String(today.getMonth() + 1).padStart(2, "0"),
      yyyy = today.getFullYear(),
      nextYear = yyyy + 1,
      dayMonth = "09/30/",
      birthday = dayMonth + yyyy;
  
  today = mm + "/" + dd + "/" + yyyy;
  if (today > birthday) {
    birthday = dayMonth + nextYear;
  }
  //end
  
  const countDown = new Date(birthday).getTime(),
      x = setInterval(function() {    

        const now = new Date().getTime(),
              distance = countDown - now;

        document.getElementById("days").innerText = Math.floor(distance / (day)),
          document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
          document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
          document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

        //do something later when date is reached
        if (distance < 0) {
          document.getElementById("headline").innerText = "It's my birthday!";
          document.getElementById("countdown").style.display = "none";
          document.getElementById("content").style.display = "block";
          clearInterval(x);
        }
        //seconds
      }, 0)
  }());



  (function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
  
    //I'm adding this section so I don't have to keep updating this pen every year :-)
    //remove this if you don't need it
    let today = new Date(),
        dd = String(today.getDate()).padStart(3, "0"),
        mm = String(today.getMonth() + 1).padStart(3, "0"),
        yyyy = today.getFullYear(),
        nextYear = yyyy + 1,
        dayMonth = "08/30/",
        birthday = dayMonth + yyyy;
    
    today = mm + "/" + dd + "/" + yyyy;
    if (today > birthday) {
      birthday = dayMonth + nextYear;
    }
    //end
    
    const countDown = new Date(birthday).getTime(),
        x = setInterval(function() {    
  
          const now = new Date().getTime(),
                distance = countDown - now;
  
          document.getElementById("days1").innerText = Math.floor(distance / (day)),
            document.getElementById("hours1").innerText = Math.floor((distance % (day)) / (hour)),
            document.getElementById("minutes1").innerText = Math.floor((distance % (hour)) / (minute)),
            document.getElementById("seconds1").innerText = Math.floor((distance % (minute)) / second);
  
          //do something later when date is reached
          if (distance < 0) {
            document.getElementById("headline1").innerText = "It's my birthday!";
            document.getElementById("countdown1").style.display = "none";
            document.getElementById("content1").style.display = "block";
            clearInterval(x);
          }
          //seconds
        }, 0)
    }());

    (function () {
      const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;
    
      //I'm adding this section so I don't have to keep updating this pen every year :-)
      //remove this if you don't need it
      let today = new Date(),
          dd = String(today.getDate()).padStart(4, "0"),
          mm = String(today.getMonth() + 1).padStart(4, "0"),
          yyyy = today.getFullYear(),
          nextYear = yyyy + 1,
          dayMonth = "07/30/",
          birthday = dayMonth + yyyy;
      
      today = mm + "/" + dd + "/" + yyyy;
      if (today > birthday) {
        birthday = dayMonth + nextYear;
      }
      //end
      
      const countDown = new Date(birthday).getTime(),
          x = setInterval(function() {    
    
            const now = new Date().getTime(),
                  distance = countDown - now;
    
            document.getElementById("days2").innerText = Math.floor(distance / (day)),
              document.getElementById("hours2").innerText = Math.floor((distance % (day)) / (hour)),
              document.getElementById("minutes2").innerText = Math.floor((distance % (hour)) / (minute)),
              document.getElementById("seconds2").innerText = Math.floor((distance % (minute)) / second);
    
            //do something later when date is reached
            if (distance < 0) {
              document.getElementById("headline2").innerText = "It's my birthday!";
              document.getElementById("countdown2").style.display = "none";
              document.getElementById("2").style.display = "block";
              clearInterval(x);
            }
            //seconds
          }, 0)
      }());
      (function () {
        const second = 1000,
              minute = second * 60,
              hour = minute * 60,
              day = hour * 24;
      
        //I'm adding this section so I don't have to keep updating this pen every year :-)
        //remove this if you don't need it
        let today = new Date(),
            dd = String(today.getDate()).padStart(4, "0"),
            mm = String(today.getMonth() + 1).padStart(4, "0"),
            yyyy = today.getFullYear(),
            nextYear = yyyy + 1,
            dayMonth = "07/30/",
            birthday = dayMonth + yyyy;
        
        today = mm + "/" + dd + "/" + yyyy;
        if (today > birthday) {
          birthday = dayMonth + nextYear;
        }
        //end
        
        const countDown = new Date(birthday).getTime(),
            x = setInterval(function() {    
      
              const now = new Date().getTime(),
                    distance = countDown - now;
      
              document.getElementById("days3").innerText = Math.floor(distance / (day)),
                document.getElementById("hours3").innerText = Math.floor((distance % (day)) / (hour)),
                document.getElementById("minutes3").innerText = Math.floor((distance % (hour)) / (minute)),
                document.getElementById("seconds3").innerText = Math.floor((distance % (minute)) / second);
      
              //do something later when date is reached
              if (distance < 0) {
                document.getElementById("headline3").innerText = "It's my birthday!";
                document.getElementById("countdown3").style.display = "none";
                document.getElementById("2").style.display = "block";
                clearInterval(x);
              }
              //seconds
            }, 0)
        }());