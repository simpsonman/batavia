package co.kr.ccg;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.CDL;
import org.json.JSONException;

@WebServlet("/ExampleLoad")
public class ExampleLoad extends HttpServlet {	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String csv = "";
		 try {
			 Scanner scanner = new Scanner(new File("D:/Projects/Java/CUVIEW/WebContent/fakedata.csv"));
			 while(scanner.hasNext())
				 csv += scanner.next()+"\n";
			 scanner.close();
		 } catch (FileNotFoundException e) {
			 e.printStackTrace();
		 }
		        
		 try {
			 //response.setContentType("application/json");
			 PrintWriter out = response.getWriter();
			 out.print((CDL.toJSONArray(csv)).toString());
		 } catch (JSONException e) {	
			 e.printStackTrace();
		 }			
	}
}
