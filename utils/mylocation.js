// ( 6371 * acos( cos( radians(37) ) * cos( radians( 37 ) ) * cos( radians( 127 ) - radians(127) ) + sin( radians(37) ) * sin( radians( 37 ) ) ) )


Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};




console.log(( 6371 * Math.acos( Math.cos( Math.radians(37) ) * Math.cos( Math.radians( 37 ) ) * Math.cos( Math.radians( 127 ) - Math.radians(127) ) + Math.sin( Math.radians(37) ) * Math.sin( Math.radians( 37 ) ) ) ));



