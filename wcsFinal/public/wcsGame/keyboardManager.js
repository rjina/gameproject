/**
 * Created by HongIl on 2015-09-02.
 */

function keyboardPlayer() {

    var x = Math.abs(Math.random() * (16 * 25) + 16*4);
    var y = Math.abs(Math.random() * (16 * 12) + 16*4);

    var player = new WCS.class.keyboardPlayer(x, y, "kim");



    return {
        setEnemy: function(data){
            player.setEnemy(data);
        },
        player: player
    }



}