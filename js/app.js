function Mahasiswa(id, nama_mahasiswa, nim_mahasiswa){
	this.id = id;
	this.nama_mahasiswa = nama_mahasiswa;
	this.nim_mahasiswa = nim_mahasiswa;
}

$(document).ready(function(){
	var db = openDatabase('db_mahasiswa', '1.0', 'Simple CRUD WEB SQL by putradongkal', 2 * 1024 * 1024);
	var sql = "CREATE TABLE IF NOT EXISTS mahasiswa(id integer primary key ";
		sql += "autoincrement, nama_mahasiswa, nim_mahasiswa)";
	db.transaction(function(x){
		x.executeSql(sql);
	});

	tampilkan_data(db);

	$('#simpan').click(function(){
		tambah_data(objek(), db);
		tampilkan_data(db);
	});

	$('#simpan-perubahan').click(function(){
		update_data(objek(), db);
		tampilkan_data(db);
		tampilkan_tombol();
		kosongkan();
	});

	$('#batal').click(function(){
		tampilkan_tombol();
		kosongkan();
	});

})

function objek(){
	var mahasiswa = new Mahasiswa(
		parseInt($('#id').val()),
		$('#nama').val(),
		$('#nim').val()
		);
	return mahasiswa;
}

function tambah_data(mahasiswa, db){
	if(mahasiswa.nama_mahasiswa != '' && mahasiswa.nim_mahasiswa != ''){
		db.transaction(function(x){
			var sql = "INSERT INTO mahasiswa (nama_mahasiswa, nim_mahasiswa)";
				sql += "VALUES(?, ?)";
			x.executeSql(sql, [mahasiswa.nama_mahasiswa, mahasiswa.nim_mahasiswa]);
		});

		kosongkan();
	}else{
		alert("Harap isi semua kolom inputan!");
	}
}

function hapus_data(id, db){
	db.transaction(function(x){
		x.executeSql("DELETE FROM mahasiswa where id = "+id);
	});
}

function update_data(mahasiswa, db){
	db.transaction(function(x){
		var sql = "UPDATE mahasiswa set nama_mahasiswa = ?, nim_mahasiswa = ? WHERE id = ?";
		x.executeSql(sql, [mahasiswa.nama_mahasiswa, mahasiswa.nim_mahasiswa, mahasiswa.id]);
	});
}

function ubah_data(id, db){
	db.transaction(function(x){
		x.executeSql("SELECT * FROM mahasiswa WHERE id="+id, [], function(x, result){
			$("#id").val(result.rows.item(0).id);
			$("#nama").val(result.rows.item(0).nama_mahasiswa);
			$("#nim").val(result.rows.item(0).nim_mahasiswa);
		});
	});
}

function tampilkan_data(db){
	db.transaction(function(x){
		x.executeSql("SELECT * FROM mahasiswa", [], function(x, result){
			var data = "";
			for(var i = 0; i < result.rows.length; i++){
				data += "<tr>";
				data += "<td>" + result.rows.item(i).nama_mahasiswa + "</td>";
				data += "<td>" + result.rows.item(i).nim_mahasiswa + "</td>";
				data += "<td><span class = 'hapus' data-id='" + result.rows.item(i).id + "'>hapus </span>";
				data += "<span class = 'ubah' data-id='" + result.rows.item(i).id + "'> ubah</span></td>";
			}

			$('#table-mahasiswa tbody').html(data);
			$('.hapus').click(function(){
				var konfirmasi = confirm("Hapus mahasiswa ?");
				if(konfirmasi == 1){
					hapus_data($(this).attr('data-id'), db);
					tampilkan_data(db);
				}
			});

			$('.ubah').click(function(){
				ubah_data($(this).attr('data-id'), db);
				$('#simpan').hide();
				$('#simpan-perubahan').show();
				$('#batal').show();
			});

		});
	});
}

function kosongkan(){
	$('#nama').val('');
	$('#nim').val('');
}

function tampilkan_tombol(){
	$('#simpan').show();
	$('#simpan-perubahan').hide();
	$('#batal').hide();
}