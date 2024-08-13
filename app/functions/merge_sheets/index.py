import sys

sys.path.insert(0, "./pypkg")
import pymysql as mysql
import dbConfig as db
import zipfile
import base64


def main(event, context):
    try:
        ids = event["ids"]
        path_date = event["path_date"]
        files_list = event["files_list"]
        batch = str(event["batch"]).zfill(2)
        export_type = int(event["export_type"])
        zipFileName = (
            f"{path_date}_{batch}_出货单{'合并'if export_type==0 else ''}导出.zip"
        )
        # merged_ids = sheets_tobe_merged(ids)
        zip_file = compress_files(files_list)
        return {"file": zip_file, "name": zipFileName, "status": 0, "info": None}
    except Exception as err:
        return {"status": -1, "info": str(err)}


def sheets_tobe_merged(ids):
    try:
        conn = mysql.connect(
            host=db.host, user=db.user, passwd=db.passwd, database=db.database
        )
        placeholder = ",".join(["%s"] * len(ids))
        with conn.cursor() as cursor:
            sql = f"""SELECT DISTINCT ent_id FROM export_rec 
            LEFT JOIN department ON department.id=export_rec.dept_id 
            WHERE export_rec.id in ({placeholder}) AND id_in_batch>1;"""
            cursor.execute(sql, ids)
            ent_tobe_merged = [x[0] for x in cursor.fetchall()]

            ids_tobe_merged = []
            for ent_id in ent_tobe_merged:
                sql = f"""SELECT export_rec.id FROM export_rec
                LEFT JOIN department ON department.id=export_rec.dept_id
                WHERE export_rec.id IN ({placeholder}) AND ent_id=%s;"""
                cursor.execute(sql, ids + [ent_id])
                rec_ids = [x[0] for x in cursor.fetchall()]
                ids_tobe_merged.append(rec_ids)
            return ids_tobe_merged

    except:
        raise IOError("Query database error")


def compress_files(files_list):
    try:
        fileName = "/tmp/export.zip"
        files = [
            {"name": f["name"], "file": base64.b64decode(f["file"])} for f in files_list
        ]
        with zipfile.ZipFile(fileName, "w") as zf:
            for file in files:
                zf.writestr(file["name"], file["file"], zipfile.ZIP_DEFLATED)
        with open(fileName, "rb") as f:
            content = base64.b64encode(f.read()).decode("utf-8")
        return content
    except Exception as err:
        print(err)
        raise IOError("Create zip error")
