var Lyrics = {
		
	parse:function(rawData){
		var attributes={"title":"str", "artist":"str", "language":"str", "genre":"str", "videogap":"float", "bpm":"float", "gap":"int", "medleystartbeat":"int", "medleyendbeat":"int", "cover":"str", "video":"str", "mp3":"str", "youtube":"str"};
		var types={":":"regular", "*":"golden", "F":"freestyle", "-":"break"};
		var finalStruc= {"lyrics":[]};
		var l = rawData.split("\n");
		for(var li in l){
			var raw = l[li];
			if(raw.indexOf("#")!=-1){
				//Special tag
				raw = raw.split(":");
				var tagName = raw[0].toLowerCase().replace("#", "");
				var tagValue = raw[1];
				if(tagName in attributes){
					tagValue = attributes[tagName]=="float"?parseFloat(tagValue.replace(',','.')):tagValue;
					tagValue = attributes[tagName]=="int"?parseInt(tagValue):tagValue;
					tagValue = tagName=="videogap" && tagValue<0?0:tagValue;
					//tagValue = attributes[tagName]=="str"?tagValue.slice(0, -1):tagValue;
					finalStruc[tagName]=tagValue;
				}
			}else{
				if(raw.length>1){
					raw = raw.split(" ");
					var result = raw.slice(0,4);
					result.push(raw.slice(4).join(' '));
					var pitch = parseInt(result[3]);
					pitch = pitch<0?12-(pitch*-1):pitch;
					var lyric = {"id":parseInt(li),"type":types[result[0]], "beat":parseInt(result[1]), "duration":parseInt(result[2]), "pitch":pitch, "text":unescape(result[4])}
					finalStruc["lyrics"].push(lyric);
				}
			}
		}
		return finalStruc;
	}
		
}
window.Lyrics = Lyrics;